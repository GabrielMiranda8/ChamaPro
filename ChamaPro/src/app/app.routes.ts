import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then((m) => m.CadastroPage),
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.page').then((m) => m.MenuPage),
  },
  {
    path: 'view',
    loadComponent: () => import('./pages/view/view.page').then((m) => m.ViewPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./tabs/inicio/inicio.page').then(m => m.InicioPage),
      },
      {
        path: 'busca',
        loadComponent: () => import('./tabs/busca/busca.page').then(m => m.BuscaPage),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./tabs/pedidos/pedidos.page').then(m => m.PedidosPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./tabs/perfil/perfil.page').then(m => m.PerfilPage),
      },
      {
        path: 'update',
        loadComponent: () => import('./tabs/update/update.page').then((m) => m.UpdatePage),
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'add-servico/:id',
    loadComponent: () => import('./pages/add-servico/add-servico.page').then(m => m.AddServicoPage)
  },
  
  {
    path: '**',
    redirectTo: 'login',
  },



];
