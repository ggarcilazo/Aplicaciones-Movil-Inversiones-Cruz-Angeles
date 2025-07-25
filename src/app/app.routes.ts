import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage),
      },
      {
        path: 'carrito',
        loadComponent: () => import('./pages/carrito/carrito.page').then(m => m.CarritoPage),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pages/pedidos/pedidos.page').then(m => m.PedidosPage),
      },
      {
        path: 'contacto',
        loadComponent: () => import('./pages/contacto/contacto.page').then(m => m.ContactoPage),
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./pages/nosotros/nosotros.page').then(m => m.NosotrosPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./pedidos/pedidos.page').then( m => m.PedidosPage)
  }
];
