import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Navbar, Row, Nav, Offcanvas } from 'react-bootstrap';
import potrace from 'potrace';
import './index.scss';
import sweetAlert from 'sweetalert2';
import { initialSVG } from './initial-svg';
import { initialUploadData } from './initial-upload-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown, faImage, faBars, faX } from '@fortawesome/free-solid-svg-icons';
import OptionsForm from './OptionsForm';

function ImageConverter() {
    const [SVG, setSVG] = useState(initialSVG);
    const [uploadData, setUploadData] = useState(initialUploadData);
    const [uploadName, setUploadName] = useState('logo');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [options, setOptions] = useState({
        threshold: 78,
        turdSize: 12,
        alphaMax: 10,
    });

    useEffect(() => {
        // console.log('SVG: ', SVG);
        // console.log('uploadData: ', uploadData);
        // console.log('options: ', options);
    }, [SVG, uploadData, options]);

    function selectFile(e) {
        const type = e.target.files[0].type;

        // Check file type
        if (!['image/png', 'image/jpeg'].includes(type)) {
            sweetAlert.fire({
                title: 'Wrong File Type',
                html: `<p class='text-align-center'>JPEG and PNG Only</p>`,
                buttonsStyling: false,
            });

            e.target.value = '';

            return;
        }

        // Read file and set uploadData
        var fr = new FileReader();

        fr.onload = function () {
            setUploadData(fr.result);
        };

        fr.readAsDataURL(e.target.files[0]);

        // Set filename
        let filename = e.target.files[0].name;

        filename = filename.replace('.png', '');
        filename = filename.replace('.jpg', '');
        filename = filename.replace('.jpeg', '');
        filename = filename.replace('.svg', '');
        filename = filename.replace('.PNG', '');
        filename = filename.replace('.JPG', '');
        filename = filename.replace('.JPEG', '');
        filename = filename.replace('.SVG', '');

        setUploadName(filename);
    }

    async function handleConvert() {
        if (!uploadData) return;

        var trace = new potrace.Potrace();

        // You can also pass configuration object to the constructor
        trace.setParameters({
            ...options,
            threshold: Math.round(options.threshold * 2.55),
            alphaMax: options.alphaMax / 20,
        });

        trace.loadImage(uploadData, function (err) {
            if (err) throw err;

            const svg = trace.getSVG(); // returns SVG document contents

            setSVG(svg);
        });
    }

    async function downloadSvg() {
        const svgXml = new XMLSerializer().serializeToString(document.getElementById('previewContainer').children[0]);

        const svgBase64 = 'data:image/svg+xml;base64,' + btoa(svgXml);

        const base64Response = await fetch(svgBase64);

        const blob = await base64Response.blob();

        const file = new File([blob], `${uploadName}.svg`, {
            type: 'image/svg+xml',
        });

        const link = document.createElement('a');
        link.setAttribute('download', `${uploadName}.svg`);
        link.setAttribute('href', URL.createObjectURL(file));
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="App">
            <Navbar bg="primary" fixed="top" className="mb-5">
                <Container>
                    <Navbar.Brand className="logo">
                        IMAGE 2 SVG
                        <FontAwesomeIcon icon={faImage} className="ms-3" />
                    </Navbar.Brand>

                    <Nav className="d-flex align-items-center">
                        <Nav.Link target="_blank" href="https://github.com/" className="link">
                            GitHub
                        </Nav.Link>
                        <Button variant="primary" onClick={handleShow} className="d-block d-sm-none">
                            <FontAwesomeIcon icon={show ? faX : faBars} className="logo" />
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header className="d-flex justify-content-end" closeButton></Offcanvas.Header>
                <Offcanvas.Body>
                    <OptionsForm handleConvert={handleConvert} setOptions={setOptions} options={options} uploadData={uploadData} selectFile={selectFile} setShow={setShow} />
                </Offcanvas.Body>
            </Offcanvas>

            <div className="about">
                <Container>
                    <h2 className="subtitle mb-1">Convert PNG's and JPG's to solid SVG's!</h2>
                    <p className="mb-1">
                        Upload a JPG or a PNG, configure the settings, and click preview to convert your image to a solid SVG. Play with the options until you get the image
                        you want and click download at the bottom right to save it.
                    </p>
                </Container>
            </div>

            <Container className="mt-5">
                <Row className="mb-5">
                    <Col className="d-none d-sm-block" xs={0} sm={4}>
                        <OptionsForm handleConvert={handleConvert} setOptions={setOptions} options={options} uploadData={uploadData} selectFile={selectFile} />
                    </Col>

                    <Col xs={12} sm={8} className="d-flex justify-content-start">
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '100%',
                                height: 'fit-content',
                            }}
                        >
                            <div id="previewContainer" className={'preview'} dangerouslySetInnerHTML={{ __html: SVG }} />

                            <Button className={'downloadBtn'} onClick={downloadSvg}>
                                <FontAwesomeIcon icon={faCloudArrowDown} className="me-2" />
                                Download
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ImageConverter;
