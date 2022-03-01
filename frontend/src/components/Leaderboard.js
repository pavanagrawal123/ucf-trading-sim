import List from '@mui/material/List';

function Leaderboard({ data }) {
  const positions = data
    ? data.leaderboardData
    : {
        Samuel: {
          position: -1,
          cash: 1000,
        },
        John: {
          position: -2,
          cash: 2000,
        },
        Tyler: {
          position: 3,
          cash: 3000,
        },
      };

  return (
    <div className='bg-white rounded-xl h-full'>
      {/* <p className='text-center text-lg pt-2'>Order Book</p> */}
      <div className='min-h-[40vh] max-h-[80vh] pt-4 overflow-y-auto'>
        <p className='text-center text-teal-500 text-2xl pb-2'>Leaderboard</p>
        <div className='flex flex-col justify-center'>
          <div className='grid gap-4 grid-cols-3 content-center justify-center pb-2'>
            <p className='text-center font-bold text-lg'>Name</p>
            <p className='text-center font-bold text-lg'>Position</p>
            <p className='text-center font-bold text-lg'>Cash</p>
          </div>
          <List>
            {Object.entries(positions).map((position, index) => {
              return (
                <div className='grid gap-6 grid-cols-3 content-center justify-center pb-2'>
                  <p className='text-center'>
                    {index + 1}. {position[0]}
                  </p>
                  <p className='text-center'>{position[1].position}</p>
                  <p className='text-center'>{position[1].cash}</p>
                </div>
              );
            })}
          </List>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
