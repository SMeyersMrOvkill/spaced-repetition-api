const LinkedList = require('../LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getHeadWord(db, language_id, head) {
    return db.from('word').select(
      'id',
      'language_id',
      'original',
      'translation',
      'next',
      'memory_value',
      'correct_count',
      'incorrect_count'
    ).where({language_id, id: head}).first()
  },

  guessWord(db, language, word, guess) {
    if(word.translation === guess.toLowerCase()) {
      language.total_score++;
      word.correct_count++;
      word.memory_value *= 2;
    } else {
      word.incorrect_count++;
      word.memory_value = 1;
    }
    language.head = word.next;
    if(language.head === null) {
      language.head = 1;
    }
    return db('language')
    .where('id', language.id)
    .update(language)
    .then(() => {
      return db('word')
      .where('id', word.id)
      .update(word).then(() => {
        return this.calculateMemeoryValues(db, language, word)
      })
    })
  },

  populateLinkedList(db, language_id) {
    return this.getLanguageWords(db, language_id).then(words => {
      let list = new LinkedList();
      words.forEach(word => {
        list.insertLast(word);
      })
      return list;
    })
  },

  calculateMemeoryValues(db, language, word) {
    return this.populateLinkedList(db, language.id).then(list => {
      list.moveWordBack(word, word.memory_value);
      return {language, word};
    })
  }
}

module.exports = LanguageService
