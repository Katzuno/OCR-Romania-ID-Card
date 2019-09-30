
async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    // Performs label detection on the image file
    const [result] = await client.textDetection('https://www.gazetabt.ro/wp-content/uploads/2013/09/buletin-de-romania.jpg');
    const detections = result.textAnnotations;

    console.log('Text:');
    buletinObj = {};

    adresa = 1;
    for (var i in detections)
    {
        currText = detections[i].description;
        if (currText.length === 13 && /^\d+$/.test(currText) )
        {
            buletinObj.CNP = currText;
        }

        if (i > 1)
        {
            if (prevText === "SERIA")
            {
                buletinObj.SERIA = currText;
            }

            if (prevText === "NR")
            {
                buletinObj.NR = currText;
            }

            if (prevText === "name" && !("NUME" in buletinObj))
            {
                buletinObj.NUME = currText;
            }

            if (prevText === "name" && "NUME" in buletinObj)
            {
                buletinObj.PRENUME = currText;
            }


            if ("ADRESA" in buletinObj && (currText.includes("Valab") || currText.includes("Emis") ) )
            {
                adresa = 0;
            }

            if (prevText.includes("Address") && !("ADRESA" in buletinObj) && adresa === 1)
            {
                buletinObj.ADRESA = currText;
                adresa = 2; // START BUILDING ADDRESS
            }
            else if ("ADRESA" in buletinObj && adresa === 2 )
            {
                buletinObj.ADRESA += " " + currText;
            }


        }

        prevText = currText;
    }

    console.info(buletinObj);
}

quickstart();