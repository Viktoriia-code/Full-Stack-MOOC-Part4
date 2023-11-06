const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const updatedUser = await User.findById(user.id)

  /*const users = await User.find({})
  const userId = users[Math.floor(Math.random()*users.length)]
  console.log(userId)
  const user = await User.findById(userId)*/

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: updatedUser._id
  })

  if (!blog.title || !blog.url) {
    response.status(404).end()
  }

  const savedNote = await blog.save()

  updatedUser.blogs = updatedUser.blogs.concat(savedNote._id)
  await updatedUser.save()

  response.status(201).json(savedNote)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const newComment = request.body.content

  blog.comments.push(newComment)
  const updatedBlog = await blog.save()

  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'A blog can be deleted only by the user who added the blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
  }

  const updatedNote = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true }
  )

  if (!updatedNote) {
    response.status(404).json({ error: 'Blog not found' })
  } else {
    response.json(updatedNote)
  }
})

module.exports = blogsRouter