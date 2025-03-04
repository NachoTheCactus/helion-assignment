declare global {
    let mongoose: {
      conn: any;
      promise: Promise<any> | null;
    };
  }
  
  export {};