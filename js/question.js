export default function question(question, choices, answerKey){
    this.question = question;
    this.choices = choices;
    this.answerKey = answerKey;
}
question.prototype.isCorrect = function (guessKey) {
    return guessKey === this.answerKey;
}