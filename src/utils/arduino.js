let port;
let writer;

export async function connectArduino() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const encoder = new TextEncoder();
    writer = port.writable.getWriter();

    console.log("Arduino connected");
  } catch (err) {
    console.error("Arduino connection failed", err);
  }
}

export async function sendArduinoCommand(command) {
  if (!writer) return;

  const encoder = new TextEncoder();
  await writer.write(encoder.encode(command + "\n"));
}