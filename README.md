# 🤖 AI Note-Making App

A modern, intelligent note-taking application built for students with AI-powered features, rich text editing, and smart organization capabilities.

![AI Notes App](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 **Authentication System**
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware

### 📝 **Rich Note Management**
- **Rich Text Editor** with formatting (bold, italic, lists, quotes)
- **Create, Edit, Delete** notes with auto-save
- **Search Functionality** - Find notes by title and content
- **Favorites System** - Mark important notes with ❤️
- **Real-time Updates** - Changes saved instantly

### 🏷️ **Smart Organization**
- **Categories** - Color-coded organization system
- **Tags** - Multiple labels per note (coming soon)
- **Filtering** - View by category, favorites, or search
- **Sorting** - By date, title, or relevance

### 🤖 **AI-Powered Features** (Coming Soon)
- **Semantic Search** - Find notes by meaning, not just keywords
- **Smart Recommendations** - Suggest related notes
- **Auto Summaries** - Generate summaries of long notes
- **Content Analysis** - Extract key topics and insights

### 📱 **Modern UI/UX**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Comfortable viewing in any environment
- **Intuitive Interface** - Clean, student-friendly design
- **Fast Performance** - Optimized for speed and efficiency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vijaytomar01/Note-Making-Ai-Bot.git
   cd Note-Making-Ai-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   # MongoDB Configuration (optional - uses file storage by default)
   MONGODB_URI=mongodb://localhost:27017/ai-notes-app

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # OpenAI Configuration (for AI features)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💾 Database Options

### File-Based Storage (Default)
- **No setup required** - Works out of the box
- **JSON files** stored in `/data` directory
- **Perfect for development** and small deployments
- **Automatic persistence** - Data saved locally

### MongoDB (Optional)
- **Scalable solution** for production
- **Install MongoDB** locally or use MongoDB Atlas
- **Update MONGODB_URI** in environment variables
- **Automatic migration** from file storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Editor**: TipTap (Rich text editing)
- **Authentication**: JWT, bcrypt
- **Database**: File-based JSON / MongoDB
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📁 Project Structure

```
ai-notes-app/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   └── dashboard/      # Main app pages
│   ├── components/         # React components
│   │   ├── auth/          # Auth components
│   │   ├── notes/         # Note components
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── store/             # State management
│   └── types/             # TypeScript types
├── data/                  # Local JSON database
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🌟 Usage

1. **Register/Login** - Create your account or sign in
2. **Create Notes** - Click "New Note" and start writing
3. **Format Text** - Use the rich text editor toolbar
4. **Organize** - Create categories and mark favorites
5. **Search** - Find any note instantly with the search bar
6. **Manage** - Edit, delete, or organize your notes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vijay Tomar**
- GitHub: [@vijaytomar01](https://github.com/vijaytomar01)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Rich text editing with [TipTap](https://tiptap.dev/)

---

⭐ **Star this repository if you find it helpful!**
