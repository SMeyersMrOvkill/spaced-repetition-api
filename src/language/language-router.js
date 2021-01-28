const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .use(requireAuth)
  .get('/head', async (req, res, next) => {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id,
    );
    const word = await LanguageService.getHeadWord(
      req.app.get('db'),
      language.id,
      language.head
    )
    return res.json({
      nextWord: word.original,
      totalScore: language.total_score,
      wordCorrectCount: word.correct_count,
      wordIncorrectCount: word.incorrect_count
    })
  })

languageRouter
  .use(requireAuth)
  .use(jsonBodyParser)
  .post('/guess', async (req, res, next) => {
    const { guess } = req.body;
    console.log('Performing guess for', guess, req.body);
    if(!guess) {
      return res.status(400).json({
        status: -1,
        message: 'Must include guess in request body.'
      })
    }
    let language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );
    let word = await LanguageService.getHeadWord(
      req.app.get('db'),
      language.id,
      language.head
    );
    const langWord = await LanguageService.guessWord(req.app.get('db'), language, word, guess);
    const newWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      language.id,
      word.next!==null ? word.next : 1
    );
    return res.json({
      nextWord: newWord.original,
      wordCorrectCount: langWord.word.correct_count,
      wordIncorrectCount: langWord.word.incorrect_count,
      totalScore: langWord.language.total_score,
      answer: langWord.word.translation,
      isCorrect: word.translation === guess.toLowerCase()
    })
  })

module.exports = languageRouter
