import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface PosicaoModel {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalizacaoService {

  // Devolve a posição atual ou null (permissão negada, GPS desligado, timeout).
  // Nunca lança erro: quem chama só precisa testar se veio null ou não.
  async obterPosicaoAtual(): Promise<PosicaoModel | null> {
    try {
      // No celular (nativo) precisamos pedir permissão antes.
      // No navegador, o próprio getCurrentPosition já pergunta ao usuário.
      if (Capacitor.isNativePlatform()) {
        const permissao = await Geolocation.checkPermissions();

        if (permissao.location !== 'granted') {
          const resposta = await Geolocation.requestPermissions();
          if (resposta.location !== 'granted') {
            return null;
          }
        }
      }

      const posicao = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false, // precisão "aproximada" basta e gasta menos bateria
        timeout: 10000,
      });

      return {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      };
    } catch (err) {
      console.log('Erro ao obter posição: ', err);
      return null;
    }
  }

  // Fórmula de Haversine: distância em km entre dois pontos na superfície da Terra.
  calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const raioTerraKm = 6371;

    const difLat = this.paraRadianos(lat2 - lat1);
    const difLon = this.paraRadianos(lon2 - lon1);

    const a =
      Math.sin(difLat / 2) * Math.sin(difLat / 2) +
      Math.cos(this.paraRadianos(lat1)) * Math.cos(this.paraRadianos(lat2)) *
      Math.sin(difLon / 2) * Math.sin(difLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return raioTerraKm * c;
  }

  private paraRadianos(graus: number): number {
    return graus * Math.PI / 180;
  }
}