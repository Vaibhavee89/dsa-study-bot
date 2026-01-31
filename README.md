# DSA Study Bot
![image](https://github.com/user-attachments/assets/1987be04-d0a6-4a48-9c97-afda39afc6c5)


## Overview

The **DSA Study Bot** is an application designed to assist students in understanding **Data Structures and Algorithms (DSA)** concepts without providing direct solutions. It uses the **Groq API** to offer hints, explain key concepts, suggest approaches, and ask guiding questions. This tool is particularly useful for students preparing for technical interviews or solving problems on platforms like **LeetCode**.

The bot encourages independent problem-solving by providing thoughtful guidance and fostering a deeper understanding of DSA concepts.



## Features

- **Interactive Chat Interface**: Engage in a conversation with the bot to get personalized help on DSA problems.
- **Markdown Support**: Responses are rendered with rich text formatting, including **links**, **code blocks**, and more.
- **API Key Management**: Securely store and manage your Groq API key.
- **Responsive Design**: The application works seamlessly across various devices, including desktops, tablets, and mobile phones.


## Workflow
![Horizontal Flow Diagram for User Interaction with Grog API - visual selection](https://github.com/user-attachments/assets/1e687d79-7e7e-42d2-9821-1a85320532c6)




## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (v6 or later)
- A **Groq API Key** (you can obtain one from [Groq's website](https://groq.com/)).

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/dsa-teaching-assistant.git
   cd dsa-teaching-assistant
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root of your project.
   - Add your Groq API key to the `.env` file:
     ```env
     GROQ_API_KEY=your_api_key_here
     ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Open the Application**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).


## Docker Deployment

### Prerequisites

- **Docker** (v20.10 or later)
- **Docker Compose** (v2.0 or later)
- A **Groq API Key**

### Quick Start with Docker Compose

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/dsa-teaching-assistant.git
   cd dsa-teaching-assistant
   ```

2. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

3. **Build and Run**:
   ```bash
   docker-compose up -d
   ```

4. **Access the Application**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Docker Commands

```bash
# Build the image
docker-compose build

# Start the container (detached)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Development with Docker

For development with hot reload:

```bash
docker-compose --profile dev up dsa-study-bot-dev
```

### Manual Docker Build

```bash
# Build the image
docker build -t dsa-study-bot .

# Run the container
docker run -p 3000:3000 -e GROQ_API_KEY=your_api_key dsa-study-bot
```



## Usage

1. **Enter Your API Key**:
   - If you haven't set your API key in the `.env` file, you will be prompted to enter it when you first use the application.

2. **Start a Conversation**:
   - Share a **LeetCode problem link** and your specific question or doubt.
   - The bot will provide hints, explanations, and guiding questions to help you understand the problem without giving away the solution.

3. **View Responses**:
   - The bot's responses will be rendered with **Markdown support**, allowing for rich text formatting, including code blocks, links, and more.



## Technologies Used

- **Next.js**: A React framework for building the user interface.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Groq API**: Powers the AI-driven responses and interactions.
- **react-markdown**: A library for rendering Markdown content in the chat interface.



## Contributing

We welcome contributions! If you'd like to contribute to the project, please follow these steps:

1. **Fork the Repository**:
   - Fork the repository to your own GitHub account.

2. **Create a New Branch**:
   - Create a new branch for your feature or bug fix:
     ```bash
     git checkout -b feature-branch
     ```

3. **Make Your Changes**:
   - Make your changes and commit them with a descriptive message:
     ```bash
     git commit -am 'Add new feature'
     ```

4. **Push to the Branch**:
   - Push your changes to the branch:
     ```bash
     git push origin feature-branch
     ```

5. **Create a Pull Request**:
   - Open a **Pull Request** on GitHub, describing your changes and their purpose.



## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.



## Acknowledgments

- Thanks to the **Groq** team for providing the API that powers this application.
- Inspired by the need for better **DSA learning resources** for students and developers.



## Contact

For any questions, feedback, or issues, please feel free to reach out:

- **Email**: [VaibhaveeSingh89@gmail.com](mailto:VaibhaveeSingh89@gmail.com)
- **GitHub Issues**: Open an issue on the [GitHub repository](https://github.com/your-username/dsa-teaching-assistant/issues).

