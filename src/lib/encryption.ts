// Client-side encryption utilities for sensitive data
import { supabase } from './supabase';

// Simple encryption using Web Crypto API
export class EncryptionService {
  private static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private static async getOrCreateUserKey(userId: string): Promise<CryptoKey> {
    // In a real implementation, you'd derive this from user credentials
    // For now, we'll use a deterministic approach based on user ID
    const encoder = new TextEncoder();
    const data = encoder.encode(userId + 'mechinweb-encryption-salt');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    
    return await window.crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptPaymentData(userId: string, paymentData: any): Promise<string> {
    try {
      const key = await this.getOrCreateUserKey(userId);
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(paymentData));
      
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt payment data');
    }
  }

  static async decryptPaymentData(userId: string, encryptedData: string): Promise<any> {
    try {
      const key = await this.getOrCreateUserKey(userId);
      
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decrypted);
      
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt payment data');
    }
  }

  static async storeEncryptedPaymentMethod(paymentMethodData: {
    type: string;
    cardNumber?: string;
    expiryMonth?: number;
    expiryYear?: number;
    holderName?: string;
    isDefault?: boolean;
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Extract non-sensitive data for display
      const lastFour = paymentMethodData.cardNumber?.slice(-4) || '';
      
      // Encrypt sensitive data
      const sensitiveData = {
        cardNumber: paymentMethodData.cardNumber,
        holderName: paymentMethodData.holderName
      };
      
      const encryptedData = await this.encryptPaymentData(user.id, sensitiveData);
      
      // Store in database
      const { error } = await supabase
        .from('encrypted_payment_data')
        .insert([{
          client_id: user.id,
          encrypted_data: encryptedData,
          payment_method_type: paymentMethodData.type,
          last_four: lastFour,
          expiry_month: paymentMethodData.expiryMonth,
          expiry_year: paymentMethodData.expiryYear,
          is_default: paymentMethodData.isDefault || false
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing payment method:', error);
      throw error;
    }
  }

  static async getDecryptedPaymentMethods(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: paymentMethods, error } = await supabase
        .from('encrypted_payment_data')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Decrypt sensitive data for each payment method
      const decryptedMethods = await Promise.all(
        (paymentMethods || []).map(async (method) => {
          try {
            const decryptedData = await this.decryptPaymentData(user.id, method.encrypted_data);
            return {
              ...method,
              ...decryptedData
            };
          } catch (error) {
            console.error('Error decrypting payment method:', error);
            return {
              ...method,
              cardNumber: '****',
              holderName: 'Encrypted'
            };
          }
        })
      );

      return decryptedMethods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }
}