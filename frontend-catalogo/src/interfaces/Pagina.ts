export interface Banner {
    id: number;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Logo {
    id: number;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Pagina {
    id: number;
    banners: Banner[];
    logo: Logo;
    createdAt: Date;
    updatedAt: Date;
  }