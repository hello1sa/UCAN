function logout() {
    firebase.auth().signOut().then(() => {
        swal("Até mais!", "Você deslogou com sucesso!", "success");
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

firebase.auth().onAuthStateChanged(user => {
    if (user){
        findTransactions(user);
        getUser(user);
    }
})

function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

function findTransactions(user) {
    showLoading();
    firebase.firestore()
        .collection('transactions')
        .where('user.uid', '==', user.uid)
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            hideLoading();
            const transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
            // aqui é a chamada as transações
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Tem certeza dessa ação?');
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
        })

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Remover";
        deleteButton.classList.add('outline', 'danger');
        deleteButton.addEventListener('click', event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        })
        li.appendChild(deleteButton);

        const date = document.createElement('p');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);
        
        const time = document.createElement('p');
        time.innerHTML = transaction.time;
        li.appendChild(time);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);

        const type = document.createElement('p');
        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        if (transaction.description) {
            const description = document.createElement('p');
            description.innerHTML = transaction.description;
            li.appendChild(description);
        }

        orderedList.appendChild(li);
    });
}
function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a tarefa');
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();

    firebase.firestore()
        .collection("transactions")
        .doc(transaction.uid)
        .delete()
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Tarefa removida');
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}

function getUser(user) {
    var hotmail = /@hotmail.com/gi;
        var gmail = /@gmail.com/gi;
        var str = user.email ;
        var newstr = str.replace(hotmail && gmail, '');
     document.getElementById('usuario').innerHTML = newstr;
    
}

