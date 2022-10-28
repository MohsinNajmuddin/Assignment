import { Tabs } from '@mui/material';
import { keys, groupBy } from 'lodash';
import Tab from '@mui/material/Tab';
import { useState, useEffect } from 'react';
import AssetsList from './AssetsList';
import TabPanel from '../TabPanel';


export const Page = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tabList, setTabList] = useState([]);
  const [tabsData, setTabsData] = useState({});
  const handleChange = (_, v) => {
    setValue(v);
  };

  useEffect(() => {
    let ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
    ws.onopen = function(evt) {
      ws.send(JSON.stringify({active_symbols:'full', product_type: 'basic'}));
    };
  
    ws.onmessage = function(msg) {
      let data = JSON.parse(msg.data);
      if (data.msg_type === 'active_symbols') {
        const dataByCategory = groupBy(data.active_symbols, 'market_display_name');
        const categories = keys(dataByCategory);
        setTabList(categories);
        setTabsData(dataByCategory);
        setLoading(false);
      }
    };
  }, [loading]);

  return (
    <div className='page'>
      <Tabs value={value} onChange={handleChange} aria-label='Page tabs'>
        {tabList.map((title, i) => {
          return <Tab key={i} value={i} label={title} wrapped />;
        })}
      </Tabs>
      <div>
        {tabList.map((title, i) => {
          return (
            <TabPanel key={i} value={value} index={i}>
              <AssetsList assetsData={tabsData[title]} />
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
