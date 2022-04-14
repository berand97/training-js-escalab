const botonEnviar = document.querySelector('.btn-enviar')


const nameContact = document.getElementsByName('name_contact')[0];
const email = document.getElementsByName('email_contact')[0];
const phone = document.getElementsByName('tel_contact')[0];
const topic = document.getElementById('select_contact');
const commit = document.getElementsByName('commit_contact')[0];

const errrosList = document.getElementById('errors')

function showError(element, message) {
    element.classList.toggle('errors')
    errrosList.innerHTML += `<label>${message}</label> </br>`
}

function clearErrors() {
    errrosList.innerHTML = '';
}


botonEnviar.addEventListener('click', (event) => {
    event.preventDefault();
    clearErrors();
    let hasErrors = false;

    const sanitizedName = nameContact.value.trim();
    if (sanitizedName.length === 0 || sanitizedName.indexOf(' ') < 0) {
        showError(nameContact, '* El nombre debe contener un espacio o contener al menos un caracter\n')
        hasErrors = true;
    }
    const emailRe = /^\w+@\w+\.\w{2,7}$/;
    if (!emailRe.exec(email.value)) {
        showError(email, '* El correo debe tener un formato correcto\n');
        hasErrors = true;
    }

    const phoneRe = /^\+?\d{7,15}$/;
    const sanitizedPhone = phone.value.replace(' ', '');
    if (!phoneRe.exec(sanitizedPhone)) {
        showError(phone, '* El numero de telefono debe tener una longitud de 7 y 15 caracteres\n')
        hasErrors = true;
    }

    const sanitizedCommit = commit.value.trim();
    if (sanitizedCommit.length < 20) {
        showError(commit, '* El mensaje debe tener 20 caracteres\n')
        hasErrors = true;
    }
    
    if(!hasErrors){
        sendEmail(sanitizedName, email.value, sanitizedPhone, topic.value, sanitizedCommit);
    }
});



async function sendEmail(name, email, phone, select, comment) {
    const rawResponse = await fetch('https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, phone, select, comment })
    });
    const content = await rawResponse.json();
    console.log(content);
    if (Object.keys(content.errors).length > 0) {
        alert('error al enviar correo')
    } else {
        alert('correo enviado exitosamente')
    }
}
