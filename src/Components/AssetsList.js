import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { map, property, uniq, filter } from 'lodash';
import { Fab, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {Line} from 'react-chartjs-2';
import 'chart.js/auto';


const FilterPills = ({
  subCategories,
  setFilter,
  currentFilter
}) => {
  return subCategories.map((name) => (
    <Fab
      size='small'
      sx={{
        padding: '10px',
        backgroundColor: (currentFilter === name) ? '#0099FF' : '#F5F5F5',
        color: (currentFilter === name) ? 'white' : 'black',
        '&:hover': {
          backgroundColor: (currentFilter === name) ? '#00CCFF' : '#A9A9A9',
        }
      }}
      key={name}
      variant='extended'
      onClick={() => { 
        if (currentFilter === name) {
          setFilter('');
        } else {
          setFilter(name);
        }
      }}
    >
      {name}
    </Fab>
  ));
};

const LineChart = ({
  displayName
}) => {
  const state = {
    labels: [
      1666898468,
      1666898469,
      1666898470,
      1666898471,
      1666898472,
      1666898473,
      1666898474,
      1666898475,
      1666898476,
      1666898477
    ],
    datasets: [
      {
        fill: true,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        label: 'Prices',
        data: [
          952.072,
          952.07,
          952.086,
          952.102,
          952.083,
          952.08,
          952.084,
          952.097,
          952.083,
          952.097
        ]
      }
    ],
  }

  return (
    <Line
      data={state}
    />
  );
};

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 250,
    sortable: true,
    renderCell: (params) => (
      <div className='country-wrapper'>
        <span>{params.row.display_name}</span>
      </div>
    ),
  },
  {
    field: 'lastPrice',
    headerName: 'Last Price',
    sortable: true,
    width: 120,
    renderCell: (params) => {
      return params.row.spot;
    },
  },
  {
    field: 'change',
    headerName: '24h change',
    sortable: true,
    width: 120,
    renderCell: (params) => <span className='difference'>{params.row.pip}</span>,
  },
  {
    field: 'chart',
    headerName: '',
    width: 300,
    sortable: false,
    renderCell: (params) => <LineChart displayName={params.row.display_name}/>,
  },
  {
    field: 'trade',
    headerName: '',
    width: 100,
    sortable: false,
    renderCell: () => <Button variant='outlined'>TRADE</Button>,
  },
];

export const AssetsList = ({
  assetsData,
}) => {
  console.log('assetsData');
  console.log(assetsData);
  const subCategories = uniq(map(assetsData, property('submarket_display_name')));
  const [subCategoryfilter, setSubCategoryFilter] = useState('');
  const [assetsList, setAssetsList] = useState([]);

  useEffect(() => {
    if (subCategoryfilter) {
      const filteredList = filter(assetsData, ['submarket_display_name', subCategoryfilter]);
      setAssetsList(filteredList);
    } else {
      setAssetsList(assetsData);
    }
  }, [subCategoryfilter, assetsData]);

  return (
    <>
      <FilterPills subCategories={subCategories} setFilter={setSubCategoryFilter} currentFilter={subCategoryfilter}/>
      <div>
        <DataGrid
          rows={assetsList}
          columns={columns}
          rowHeight={200}
          getRowId={row => row.display_name}
          checkboxSelection={false}
          hideFooterPagination={true}
          hideFooterRowCount={true}
          hideFooter={true}
          hideFooterSelectedRowCount={true}
          autoHeight={true}
        />
      </div>
    </>
  );
};

AssetsList.prototype = {
  assetsData: PropTypes.object,
}

export default AssetsList;
