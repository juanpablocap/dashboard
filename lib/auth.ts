import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const ALLOWED_EMAIL = 'juanpablocapilla@gmail.com'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Solo permitir el email autorizado
      if (user.email !== ALLOWED_EMAIL) {
        return false
      }
      return true
    },
    async session({ session, token }) {
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
