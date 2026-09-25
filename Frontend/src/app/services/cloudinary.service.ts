import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

  constructor(private http: HttpClient) { }

  /** Envia a imagem (upload unsigned) e devolve a URL https final. */
  enviarImagem(arquivo: File): Observable<string> {
    const form = new FormData();
    form.append('file', arquivo);
    form.append('upload_preset', environment.cloudinary.uploadPreset);
    form.append('folder', environment.cloudinary.folder);

    // Sem header de autenticação: a chamada vai para o Cloudinary, não para a API do ChamaPro
    return this.http
      .post<{ secure_url: string }>(this.UPLOAD_URL, form)
      .pipe(map((res) => res.secure_url));
  }

  /** Versão otimizada da URL: recorte quadrado focado no rosto, formato/qualidade automáticos. */
  otimizar(url: string, tamanho = 400): string {
    if (!url || !url.includes('/image/upload/')) return url;
    return url.replace('/image/upload/', `/image/upload/c_fill,g_face,w_${tamanho},h_${tamanho},f_auto,q_auto/`);
  }
}
