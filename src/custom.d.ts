// custom.d.ts
interface CustomWindow extends Window {
    opera?: string;
  }
  
  declare const window: CustomWindow;
  