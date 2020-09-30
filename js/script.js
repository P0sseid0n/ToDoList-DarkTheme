let Tarefas = {}

LocalSave()

$('add').click(function(e){
    e.stopPropagation()
    $('#CreateDo').slideDown()
})
$('#CreateDo button').click(function(){
    Tarefas[(Object.keys(Tarefas).length)] = {nome: VerificarFrase($('#CreateDo input').val()), check: false}
    CreateDo()
    $('#CreateDo input').val('')
})

$('#CreateDo').click(function(e){
    e.stopPropagation()
})

$('body').click(function(){
    $('#CreateDo').slideUp()
})

function CreateDo (){
    $('section').html('')
    for (let [tarefa, obTarefa] of Object.entries(Tarefas)){
        if(Tarefas[tarefa]['check'] === true){
            $('section').append(`
            <div class="line">
                <div class="container">
                    <div><input type="checkbox" name="checkbox" id="checkbox${tarefa}" checked><label for="checkbox${tarefa}"><i class="fas fa-check"></i></label></div>
                    <div class="text" id="text${tarefa}">${Tarefas[tarefa]['nome']}</div>
                    <div class="edit" id="edit${tarefa}"><input type="text" name="edit" id="edit${tarefa}"></div>
                    <div class="buttons" id="buttons${tarefa}">
                        <button><i class="fas fa-pencil-alt"></i></button>
                        <button><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
            `)
        }
        else{
            $('section').append(`
            <div class="line">
                <div class="container">
                    <div><input type="checkbox" name="checkbox" id="checkbox${tarefa}"><label for="checkbox${tarefa}"><i class="fas fa-check"></i></label></div>
                    <div class="text" id="text${tarefa}">${Tarefas[tarefa]['nome']}</div>
                    <div class="edit" id="edit${tarefa}"><input type="text" name="edit" id="edit${tarefa}"></div>
                    <div class="buttons" id="buttons${tarefa}">
                        <button><i class="fas fa-pencil-alt"></i></button>
                        <button><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
            `)
        }
    }
    $(`.edit`).hide()
    localStorage.setItem("Tarefas", JSON.stringify(Tarefas))
    if(Object.keys(Tarefas).length == 0){
        $('section').html('<h1 id="listavazia">Lista Vazia</h1>')
    }    
}

CreateDo()

$('input[type="checkbox"]').click(function(){
    let CurrentId = $(this).attr('id').substring(8)
    let CurrentTxt = $(`#text${CurrentId}`).html()
    if($(`#checkbox${CurrentId}`).is(':checked')){
        for (let [tarefa, obTarefa] of Object.entries(Tarefas)){
            if(Tarefas[tarefa]['nome'] === CurrentTxt){
                Tarefas[tarefa]['check'] = true
            }
        }
    }
    else{
        for (let [tarefa, obTarefa] of Object.entries(Tarefas)){
            if(Tarefas[tarefa]['nome'] === CurrentTxt){
                Tarefas[tarefa]['check'] = false
            }
        }
    }
    localStorage.setItem("Tarefas", JSON.stringify(Tarefas))
})

function VerificarFrase (frase){
    let Tratament = frase
    
    console.log()
    while(Tratament.indexOf('>') >= 0 || Tratament.indexOf('<') >= 0){
        Tratament = Tratament.replace('<','&lt;')
        Tratament = Tratament.replace('>','&gt;')

    }
    
    Tratament = ProcurarLink(Tratament)
    return Tratament
}


function ProcurarLink(frase){
    let Frase = frase
    let Separada = frase.split(' ')
    let Titulo
    for(l of Separada){
        if(isUrl(l)){
            Titulo = ConsertarLink(l)
            Frase = Frase.replace(l,`<a target="_blank" href="${l}">${Titulo}</a>`)
        }
    }
    return Frase
}

function ConsertarLink(l){
    let Link = l
    Link = Link.replace('https:','')
    Link = Link.replace('http:','')
    Link = Link.replace('ftp:','')
    Link = Link.replace('//','')
    return Link
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}


let DarkMode = true
$('header i').click(function(){
    if(DarkMode){
        DarkMode = false
        $('header a').css('filter','invert(0%)')
        $('body').css('filter','invert(0%)')
        $('input').css('filter','invert(0%)')
        $('button').css('filter','invert(0%)')
        $('add').css('filter','invert(0%)')

    }
    else{
        DarkMode = true
        $('header a').css('filter','invert(100%)')
        $('body').css('filter','invert(100%)')
        $('input').css('filter','invert(100%)')
        $('button').css('filter','invert(100%)')
        $('add').css('filter','invert(100%)')

    }



})

let editar = true
$('section div.buttons button:first-of-type').click(function(){
    let CurrentId = $(this).parent().attr('id').substring(7)
    if($(`#buttons${CurrentId} button:first-of-type`).html() == '<i class="fas fa-pencil-alt"></i>'){
        editar = true
    }
    else{
        editar = false
        Tarefas[CurrentId]['nome'] = VerificarFrase($(`#edit${CurrentId} input`).val())
        CreateDo()
    }

    if (editar) {
        $(`#text${CurrentId}`).hide()
        $(`#edit${CurrentId}`).show()
        $(`#edit${CurrentId} input`).val($(`#text${CurrentId}`).text())
        $(`#buttons${CurrentId} button`).eq(0).html('<i class="fas fa-check"></i>')
    }
    else{
        $(`#text${CurrentId}`).show()
        $(`#edit${CurrentId}`).hide()
        $(`#edit${CurrentId} input`).val('')
        $(`#buttons${CurrentId} button`).eq(0).html('<i class="fas fa-pencil-alt"></i>')
    }
})

$('body').on('click','section div.buttons button:first-of-type', function(){
        let CurrentId = $(this).parent().attr('id').substring(7)
        if($(`#buttons${CurrentId} button`).html() == '<i class="fas fa-pencil-alt"></i>'){
            editar = true
        }
        else{
            editar = false
            Tarefas[CurrentId]['nome'] = VerificarFrase($(`#edit${CurrentId} input`).val())
            CreateDo()

        }
    
        if (editar) {
            $(`#text${CurrentId}`).hide()
            $(`#edit${CurrentId}`).show()
            $(`#edit${CurrentId} input`).val($(`#text${CurrentId}`).text())
            $(`#buttons${CurrentId} button`).eq(0).html('<i class="fas fa-check"></i>')
        }
        else{
            $(`#text${CurrentId}`).show()
            $(`#edit${CurrentId}`).hide()
            $(`#edit${CurrentId} input`).val('')
            $(`#buttons${CurrentId} button`).eq(0).html('<i class="fas fa-pencil-alt"></i>')
        }
})

$('section div.buttons button:nth-of-type(2)').click(function(){
    let CurrentId = $(this).parent().attr('id').substring(7)
    delete Tarefas[CurrentId]
    CreateDo()
})

$('body').on('click','section div.buttons button:nth-of-type(2)', function(){
    let CurrentId = $(this).parent().attr('id').substring(7)
    delete Tarefas[CurrentId]
    CreateDo()
})

function LocalSave(){
    if(JSON.parse(localStorage.getItem("Tarefas")) !== null){
        Tarefas = JSON.parse(localStorage.getItem("Tarefas"))
    }
}

