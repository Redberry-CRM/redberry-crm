'use client';

import React from 'react';
import { Graph01 } from '@/app/Overview/Graph01';
import { Recommendations } from '@/app/Overview/Recommendations';
import { getContactsByOwner } from "../services/contacts";
import { getFromStorage } from '@/utils/utils';
import { Loader } from '@/components';
import { useQuery } from "react-query";

export default function Home() {
  const user = getFromStorage("user");
  const { data, isLoading, isFetching, error } = useQuery("contacts", () => getContactsByOwner(user.uid));
  const notes = data ?
    data?.map((contact: any) => { if (contact.status === "Awaiting Call") { return contact.name + ' - ' + contact.note } }) :
    [];

  return (
    <div className="page-container2">
      {(isFetching || isLoading) && <Loader />}
      <h1>Overview</h1>

      <div className='row-between align-start'>
        <Graph01 data={data} />
        {notes && <Recommendations notes={notes} />}

      </div>
    </div >
  )
}
