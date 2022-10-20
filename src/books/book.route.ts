import express from 'express';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

import *  as BookService from './book.service';

export const bookRouter = express.Router();


//GET : List all the books
bookRouter.get("/", async (req: Request, res: Response) => {
  try {
    const books = await BookService.ListBooks();
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
})


//GET : get single Book by Id
bookRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const author = await BookService.getBook(id);

    if (author) {
      return res.status(200).json(author);
    }
    return res.status(400).json("Book could not be found");

  } catch (error: any) {
    return res.status(500).json(error.message);
  }
})


//POST : Creating book
//Params: title,authorId,datePublished,isFiction
bookRouter.post("/",
  body("title").isString(),
  body("authorId").isInt(),
  body("datePublished").isDate(),
  body("isFiction").isBoolean(),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const book = req.body;
      const newBook = await BookService.createBook(book);
      return res.status(201).json(newBook);
    } catch (error: any) {
      return res.status(400).json(error.message);
    }
  })


//PUT : Updating book
//Params: title,authorId,datePublished,isFiction
bookRouter.put("/:id",
  body("title").isString(),
  body("authorId").isInt(),
  body("datePublished").isDate().toDate(),
  body("isFiction").isBoolean(),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const id: number = parseInt(req.params.id, 10);
    try {
      const book = req.body;
      const updatedBook = await BookService.updateBook(book, id);
      return res.status(201).json(updatedBook);
    } catch (error: any) {
      return res.status(400).json(error.message);
    }
  })

bookRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await BookService.deleteBook(id);
    return response.status(204).json("Book was successfully deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});