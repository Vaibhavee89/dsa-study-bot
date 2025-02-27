# DSA Study Bot

## Overview

The DSA Teaching Assistant is a web application designed to help students understand Data Structures and Algorithms (DSA) concepts without giving away complete solutions to problems. It leverages the Groq API to provide hints, explain key concepts, suggest approaches, and ask guiding questions. This tool is particularly useful for students preparing for technical interviews or solving problems on platforms like LeetCode.

## Features

- **Interactive Chat Interface**: Engage in a conversation with the assistant to get personalized help.
- **Markdown Support**: Render rich text formatting, including links, code blocks, and more.
- **API Key Management**: Securely store and manage your Groq API key.
- **Responsive Design**: Works seamlessly on various devices.

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

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
   Create a `.env` file in the root of your project and add your Groq API key:

   ```plaintext
   NEXT_PUBLIC_GROQ_API_KEY=your_api_key_here
   ```

4. **Run the Application**:

   ```bash
   npm run dev
   ```

5. **Open the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Enter Your API Key**:

   - If you haven't set your API key in the `.env` file, you will be prompted to enter it when you first use the application.

2. **Start a Conversation**:

   - Share a LeetCode problem link and your specific question.
   - The assistant will provide hints and guidance to help you understand the approach without giving away the solution.

3. **View Responses**:
   - The assistant's responses will be rendered with Markdown support, allowing for rich text formatting.

## Technologies Used

- **Next.js**: React framework for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Groq API**: Powering the AI-driven responses.
- **react-markdown**: Library for rendering Markdown content.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Groq team for providing the API.
- Inspired by the need for better DSA learning resources.

## Contact

For any questions or feedback, please contact [VaibhaveeSingh89@gmail.com](mailto:VaibhaveeSingh89@gmail.com).
