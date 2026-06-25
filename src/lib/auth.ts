import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getGoogleSheet } from "./google-sheets";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        try {
          const doc = await getGoogleSheet();
          const sheet = doc.sheetsByTitle["Users"];
          
          if (!sheet) {
            throw new Error("Users sheet not found. Please initialize the database.");
          }

          const rows = await sheet.getRows();
          const userRow = rows.find(row => row.get("Username") === credentials.username);

          if (!userRow) {
            throw new Error("Invalid username or password");
          }

          const storedPassword = userRow.get("Password");
          
          // Check if password is a bcrypt hash (starts with $2)
          let isValid = false;
          if (storedPassword.startsWith("$2")) {
            isValid = await bcrypt.compare(credentials.password, storedPassword);
          } else {
            // Fallback for plain text passwords entered manually in the Google Sheet
            isValid = credentials.password === storedPassword;
          }

          if (!isValid) {
            throw new Error("Invalid username or password");
          }

          return {
            id: userRow.get("ID") || credentials.username,
            name: userRow.get("Name"),
            email: userRow.get("Username"), // Using username as email for NextAuth compatibility
            role: userRow.get("Role") || "COLLECTOR",
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
