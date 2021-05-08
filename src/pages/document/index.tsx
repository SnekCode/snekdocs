import React from 'react';
import { v4 as uuidV4 } from 'uuid';

const index = () => {
  return <div></div>;
};

export default index;

export const getServerSideProps = async ({ res }) => {
  res.redirect(`/document/${uuidV4()}`);
  return { props: {} };
};
