import axios from 'axios';

const pinataJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOWVjMWQ3YS0xMzljLTRhZmUtODA3Yy01MWQ1MTNlZjY1NGQiLCJlbWFpbCI6InNuaWZmeXRvYWQ2NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMGI3OTk1NGE2MWUyZjhkNjI2MmMiLCJzY29wZWRLZXlTZWNyZXQiOiI2OGRiZjNmZDRlNTBlYzcyNjU4MTQ4NzdiMGIyMmYxZWZmYjk4YjRmODg1MmZjYmY5NjZmYTY5YWYyODJkNDQyIiwiZXhwIjoxNzYwOTE1NTg5fQ.wqcFPst3M5NRheO0jno_2U3a91J8luT1RAOXoeHbGAc';  

export const uploadToIPFS = async (jsonData) => {
    console.log(jsonData);
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    try {
        const response = await axios.post(url, jsonData, {
            headers: {
                Authorization: `Bearer ${pinataJWT}`,
            },
        });
        return response.data.IpfsHash; // Returns the IPFS hash
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
};



