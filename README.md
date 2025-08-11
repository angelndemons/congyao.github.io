# Cong Yao - Personal Website

A modern, responsive personal website built with Next.js, React, and Tailwind CSS. Features a clean design with contact form functionality.

## Features

- 🎨 Modern, responsive design with dark mode support
- 📧 Functional contact form with email integration
- ⚡ Fast performance with Next.js
- 🎯 SEO optimized
- 📱 Mobile-friendly

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal_website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your email credentials:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note:** For Gmail, you'll need to use an App Password instead of your regular password. To generate one:
1. Go to your Google Account settings
2. Enable 2-Step Verification if not already enabled
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Use that password in the EMAIL_PASS field

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

### Personal Information
Edit `app/page.tsx` to update:
- Your name and title
- About section content
- Skills and expertise
- Contact information
- Profile picture (replace the "CY" initials with your actual image)

### Styling
The website uses Tailwind CSS for styling. You can customize colors, fonts, and layout by modifying the classes in `app/page.tsx`.

### Contact Form
The contact form is configured to send emails to the address specified in the API route (`app/api/contact/route.ts`). Update the `to` field in the mailOptions to receive emails at your preferred address.

## Deployment

### Vercel (Recommended)
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Import your project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms
You can deploy to any platform that supports Next.js. Make sure to:
- Set the environment variables for email functionality
- Configure your domain and SSL certificates

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Nodemailer](https://nodemailer.com/) - Email functionality

## License

This project is open source and available under the [MIT License](LICENSE).
