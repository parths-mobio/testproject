const translate = require('translate');

//async function translateString( str, translateTo ) 
exports.translateString = async (req, res) => {

    const str = await req.body.data;
    const translateTo = await req.body.lang;

	translate.engine = 'libre';
	const translated_string = await translate(str, translateTo);

    res.json({
        message:translated_string
    })
	console.log(translated_string);

}

// English to Spanish
//translateString('Hello World', "ru");