import { AlertController, ToastController } from "@ionic/angular";

export async function showConfirmationAlert(data: {
  controller: AlertController;
  title: string;
  message: string;
}): Promise<boolean> {
  const { controller, title, message } = data;
  return new Promise<boolean>(async (resolve) => {
    const confirm = await controller.create({
      header: title,
      message: message,
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            resolve(false); // Resolva a Promise com 'false' ao pressionar Cancelar
          },
        },
        {
          text: "Confirmar",
          handler: () => {
            resolve(true); // Resolva a Promise com 'true' ao pressionar Confirmar
          },
        },
      ],
    });
    await confirm.present();
  });
}

export async function showToast(data: {
  controller: ToastController;
  message: string;
  duration?: number;
  color?: string;
  position?: "top" | "bottom" | "middle";
}): Promise<void> {
  const { message, duration, color, position } = data;
  return new Promise<void>(async (resolve) => {
    const toast = await data.controller.create({
      message: message,
      duration: duration || 3000,
      color: color || "primary",
      position: position || "bottom",
    });
    toast.present();
    resolve();
  });
}

