import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'

export const createUser = async (req: Request, res:Response): Promise<Response> =>{

	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.first_name) throw new Exception("Please provide a first_name")
	if(!req.body.last_name) throw new Exception("Please provide a last_name")
	if(!req.body.cedula) throw new Exception("Please provide an cedula")

	const userRepo = getRepository(Users)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {cedula: req.body.cedula }})
	if(user) throw new Exception("Users already exists with this cedula")

	const newUser = getRepository(Users).create(req.body);  //Creo un usuario
	const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
	return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> =>{
		const users = await getRepository(Users).find();
		return res.json(users);
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> =>{
    const usuarioRepo = getRepository(Users);
    const USUARIO = await usuarioRepo.findOne({ where: { id: req.params.id } });
    if (!USUARIO) throw new Exception("El usuario no existe");

    const result = await usuarioRepo.delete(USUARIO);
    return res.json({ message: "Ok", result: result });
}