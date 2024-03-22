export default interface Question {
    trackId: string,
    preview_url: string,
    choices: [{
        text: string,
        correct: boolean
    }]
}