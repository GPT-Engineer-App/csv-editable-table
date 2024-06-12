import React, { useState } from "react";
import { Container, VStack, Button, Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { CSVReader } from "react-papaparse";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleOnDrop = (data) => {
    const headers = data[0].meta.fields;
    const rows = data.map((row) => row.data);
    setHeaders(headers);
    setData(rows);
  };

  const handleOnError = (err) => {
    console.error(err);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: "" }), {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (e, rowIndex, header) => {
    const newData = data.map((row, i) => {
      if (i === rowIndex) {
        return { ...row, [header]: e.target.value };
      }
      return row;
    });
    setData(newData);
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4} width="100%">
        <CSVReader onDrop={handleOnDrop} onError={handleOnError} addRemoveButton>
          <span>Drop CSV file here or click to upload.</span>
        </CSVReader>
        {data.length > 0 && (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header) => (
                    <Th key={header}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {headers.map((header) => (
                      <Td key={header}>
                        <Input
                          value={row[header]}
                          onChange={(e) => handleInputChange(e, rowIndex, header)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <Button colorScheme="red" onClick={() => handleRemoveRow(rowIndex)}>
                        <FaTrash />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} colorScheme="green" onClick={handleAddRow}>
              Add Row
            </Button>
            <Button leftIcon={<FaDownload />} colorScheme="blue" onClick={handleDownload}>
              Download CSV
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;