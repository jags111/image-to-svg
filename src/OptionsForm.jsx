import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function OptionsForm({ handleConvert, setOptions, options, uploadData, selectFile, setShow }) {
    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                handleConvert();
            }}
        >
            <Form.Group className="mb-3">
                <Form.Label className="me-1">Original Image</Form.Label>
                <div className="originalImageContainer">
                    <img src={uploadData} className="originalImage" />
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>
                    <span className="me-1">Image File (PNG or JPG)</span>
                </Form.Label>
                <Form.Control type="file" accept="image/png, image/jpeg" onChange={selectFile} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>
                    <span className="me-1">Threshold (How much color is converted to black)</span>
                </Form.Label>
                <Form.Range
                    value={options.threshold}
                    onChange={(e) =>
                        setOptions((prev) => ({
                            ...prev,
                            threshold: e.target.value,
                        }))
                    }
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>
                    <span className="me-1">Sharpness</span>
                </Form.Label>
                <Form.Range
                    style={{ transform: 'rotate(180deg)' }}
                    value={options.alphaMax}
                    onChange={(e) =>
                        setOptions((prev) => ({
                            ...prev,
                            alphaMax: e.target.value,
                        }))
                    }
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>
                    <span className="me-1">Maximum Speckle Size</span>
                </Form.Label>
                <Form.Range
                    value={options.turdSize}
                    onChange={(e) =>
                        setOptions((prev) => ({
                            ...prev,
                            turdSize: e.target.value,
                        }))
                    }
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Button
                    onClick={() => {
                        if (setShow) setShow(false);
                        handleConvert();
                    }}
                    className="me-3"
                >
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Preview
                </Button>
            </Form.Group>
        </Form>
    );
}

export default OptionsForm;
