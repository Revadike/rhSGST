function showVAIImages() {
    var Matches, I, N;
    Matches = document.getElementsByClassName(ESGST.SG ? "comment__toggle-attached" : "view_attached");
    for (I = 0, N = Matches.length; I < N; ++I) {
        Matches[I].nextElementSibling.firstElementChild.classList.remove("is-hidden", "is_hidden");
    }
}
