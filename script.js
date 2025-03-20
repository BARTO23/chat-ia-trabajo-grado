const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const API_KEY = "AIzaSyBkjT-zATE0SlBar5ds2Bamu5EiTNW33a8";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
};

const generateBotResponse = async (thinkingMessageDiv) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // Corregido "application"
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Obtener la respuesta de la API
    const apiResponseText = data.candidates[0].content.parts[0].text.trim();

    // Reemplazar el mensaje de "pensando" con la respuesta real del bot
    thinkingMessageDiv.querySelector(".message-text").textContent = apiResponseText;
  } catch (error) {
    console.error("Error en la API:", error);
    thinkingMessageDiv.querySelector(".message-text").textContent = "Error al obtener la respuesta.";
  }
};

// Verificar si los elementos existen antes de ejecutar el código
if (!chatBody || !messageInput || !sendMessageButton) {
  console.error("Error: No se encontraron algunos elementos del chat.");
} else {
  const createMessageElement = (type, content) => {
    const div = document.createElement("div");
    div.classList.add("message");

    if (type === "user") {
      // Mensaje del usuario
      div.classList.add("user-message");
      const messageText = document.createElement("div");
      messageText.classList.add("message-text");
      messageText.textContent = content;
      div.appendChild(messageText);
    } else if (type === "bot") {
      // Mensaje del bot
      div.classList.add("bot-message");

      // Crear el avatar del bot
      const botAvatar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      botAvatar.classList.add("bot-avatar");
      botAvatar.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      botAvatar.setAttribute("width", "50");
      botAvatar.setAttribute("height", "50");
      botAvatar.setAttribute("viewBox", "0 0 1024 1024");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute(
        "d",
        "M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"
      );
      botAvatar.appendChild(path);

      div.appendChild(botAvatar);

      // Crear el contenedor del mensaje
      const messageText = document.createElement("div");
      messageText.classList.add("message-text");

      if (content === "thinking") {
        // Crear el indicador de "pensando"
        const thinkingIndicator = document.createElement("div");
        thinkingIndicator.classList.add("thinking-indicator");

        // Agregar los tres puntos
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement("div");
          dot.classList.add("dot");
          thinkingIndicator.appendChild(dot);
        }

        messageText.appendChild(thinkingIndicator);
      } else {
        // Mensaje normal del bot
        messageText.textContent = content;
      }

      div.appendChild(messageText);
    }

    return div;
  };

  const handleOutgoingMessage = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Obtener el mensaje del usuario
    const userMessage = messageInput.value.trim();

    // Verificar si el mensaje está vacío
    if (!userMessage) return;

    // Guardar el mensaje y limpiar el input
    userData.message = userMessage;
    messageInput.value = "";

    // Crear y mostrar el mensaje del usuario
    const outgoingMessageDiv = createMessageElement("user", userData.message);
    chatBody.appendChild(outgoingMessageDiv);

    // Desplazar el chat hacia abajo
    chatBody.scrollTop = chatBody.scrollHeight;

    // Mostrar el indicador de "pensando"
    const thinkingMessageDiv = createMessageElement("bot", "thinking");
    chatBody.appendChild(thinkingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Obtener respuesta de la API y actualizar el mensaje
    generateBotResponse(thinkingMessageDiv);
  };

  // Event listeners
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleOutgoingMessage(e);
    }
  });

  sendMessageButton.addEventListener("click", (e) => {
    handleOutgoingMessage(e);
  });
}
