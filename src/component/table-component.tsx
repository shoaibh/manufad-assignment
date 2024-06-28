import { FC } from "react";
import { Table, TableData } from "@mantine/core";
import "@mantine/core/styles.css";

type Props = {
  caption: string;
  data: string[][];
  headers: string[];
};

export const TableComponent: FC<Props> = ({ caption, headers, data }) => {
  const tableData: TableData = {
    caption,
    head: headers,
    body: data,
  };
  return <Table data={tableData} />;
};
