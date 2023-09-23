function updateFormula(){    
    var x = document.getElementsByName('x')[0].value;
    var y = document.getElementsByName('y')[0].value;
    var operation = document.getElementsByName('operation')[0].value;
    var operationText = document.getElementsByTagName('option')[operation].innerText;
    document.getElementById('formula').innerText = `${x} ${operationText} ${y} = ?`
}

for (var i = 0; i < document.forms[0].elements.length; i++) {
    const element = document.forms[0].elements[i]
    element.onchange = updateFormula    
}