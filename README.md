# LinkIT

> Save links. Remember why.

A modern link management application that helps you organize, tag, and search your saved links with ease.

![LinkIT Banner](public/logo.png)

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth integration via NextAuth.js
- 🏷️ **Smart Tagging** - Organize links with custom tags
- 🔍 **Advanced Search** - Search by title, URL, description, or tags
- 📝 **Rich Metadata** - Add descriptions and notes to your links
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast & Reliable** - Built with Next.js 16 and PostgreSQL

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## 📦 Installation

### Prerequisites

- Node.js 20+ 
- PostgreSQL database
- Google OAuth credentials

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/vanshsharma3777/LinkIt
cd linkit
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkit?schema=public"

# NextAuth
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
```

4. **Generate Prisma client and run migrations**

```bash
npm run db:migrate
```

5. **Start the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

## 🗄️ Database
```
User
  ├── Links (one-to-many)
  └── Sessions, Accounts

Link
  ├── Tags (many-to-many)
  └── User (belongs to)
```

## 🎯 Usage

1. **Sign In** - Authenticate with your Google account
2. **Add Links** - Click "Add NewLink" to save a link with title, description, and tags
3. **Search** - Use the search bar and filter by title, URL, description, or tags
4. **Edit** - Update link details anytime
5. **Delete** - Remove links you no longer need

## 📸 Screenshots

### Landing
![Homepage](public/landing.png)

### Dashboard
![Dashboard](public/dashboard.png)

### Create Link
![Create Link](public/createLINK.png)

## 🛠️ Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:migrate

```

### Database Setup

For production, use a managed PostgreSQL service:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)
- [Railway](https://railway.app/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Vansh Sharma**

- GitHub: [@vanshsharma3777](https://github.com/vanshsharma3777)
- Twitter: [@itz_sharmaji001](https://x.com/itz_sharmaji001)
- LinkedIn: [vansh-sharma-812199316](https://www.linkedin.com/in/vansh-sharma-812199316)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- All contributors who help improve this project

## 💖 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

Built with ❤️ by Vansh Sharma