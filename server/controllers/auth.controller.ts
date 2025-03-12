import { NextFunction, Request, Response } from "express"
import { prismaDb } from "../connect/db";
import { errorHandler } from "../utils/error";
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")


export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body

  // Input validation (you can expand this depending on your needs)
  if (!firstName || !lastName || !email || !password) {
    return next(errorHandler(403, 'All fields are required!'))
  }

  try {
    // Check if the user already exists by email
    const existingUser = await prismaDb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(errorHandler(400, 'Email address already taken!')) 
    }

    // Hash 
    const hashedPassword = await bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = await prismaDb.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: 'success',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });

  } catch (e) {
    console.log("Error in signup controller", e);
    next(errorHandler(500, 'Server error, Please try again later!')) 
  }
  
}


export const signInController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password){
    return next(errorHandler(403, 'All fields are required!'))
  }
  
  try {
    const validUser = await prismaDb.user.findUnique({ where: { email } })
    
    if (!validUser){
      return next(errorHandler(404, 'Invalid email!'))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword){
      return next(errorHandler(404, 'Incorrect password!'))
    }

    const { password: pass, ...rest } = validUser
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({...rest, token})
 

  } catch (e) {
    console.log("Error in signin controller", e);
    return next(errorHandler(500, 'Server error, Please try again later!')) 
  } 
} 