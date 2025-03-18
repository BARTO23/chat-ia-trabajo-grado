const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const userData = {
  message: null
}

// Verificar si los elementos existen antes de ejecutar el código
if (!chatBody || !messageInput || !sendMessageButton) {
  console.error("Error: No se encontraron algunos elementos del chat.");
} else {
  const createMessageElement = (content, clases) => {
    const div = document.createElement("div");
    div.classList.add("message", clases);
    
    // Usamos textContent para evitar la ejecución de HTML
    const messageText = document.createElement("div");
    messageText.classList.add("message-text");
    messageText.textContent = content; 

    div.appendChild(messageText);
    return div;
  };

  // Creo que en esta funcion es bueno colocar un preventDefault (no lo olvides pablo del futuro)
  const handleOutgoingMessage = (userMessage) => {
    if (!userMessage.trim()) return; // Evita mensajes vacíos
    userData.message = messageInput.value.trim()

    const outgoingMessageDiv = createMessageElement(userMessage, "user-message");
    chatBody.appendChild(outgoingMessageDiv);

    messageInput.value = ""; // Limpia el campo de entrada después de enviar el mensaje
    chatBody.scrollTop = chatBody.scrollHeight; // Desplaza el chat hacia abajo

    setTimeout( ()=> {

    }, 600)
  };

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault();
      const userMessage = messageInput.value.trim();
      handleOutgoingMessage(userMessage);
    }
  });

  sendMessageButton.addEventListener("click", () => {
    const userMessage = messageInput.value.trim();
    handleOutgoingMessage(userMessage);
  });
}
