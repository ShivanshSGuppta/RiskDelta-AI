import { SignInInputSchema, SignUpInputSchema } from "@/lib/types";
import { prisma } from "@/server/db/prisma";
import { hashPassword, verifyPassword } from "@/server/auth/password";

export async function signUp(input: unknown) {
  const data = SignUpInputSchema.parse(input);

  const existing = await prisma.user.findUnique({
    where: { email: data.workEmail.toLowerCase() },
  });

  if (existing) {
    throw new Error("An account with that email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.workEmail.toLowerCase(),
      companyName: data.companyName,
      passwordHash: await hashPassword(data.password),
      onboardingState: {
        create: {
          currentStep: 1,
          completed: false,
        },
      },
    },
  });

  return user;
}

export async function signIn(input: unknown) {
  const data = SignInInputSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  return user;
}
