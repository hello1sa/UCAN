firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        setTimeout(() => {
            swal("Até mais!", "Você deslogou com sucesso!", "success");
            window.location.href = "../../index.html";
          }, 3000)  

    }
})
