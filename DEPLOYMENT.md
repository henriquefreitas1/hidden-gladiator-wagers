# 🚀 Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Hidden Gladiator Wagers application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository access
- Domain name (optional, for custom domain)

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project" on the dashboard
3. Import the `henriquefreitas1/hidden-gladiator-wagers` repository
4. Click "Import" to proceed

### 2. Configure Build Settings

Vercel should automatically detect this as a Vite project. Verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables Configuration

Click "Environment Variables" and add the following variables:

#### Required Environment Variables

```bash
# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=your_sepolia_rpc_url_here

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Infura Configuration (Optional)
VITE_INFURA_API_KEY=your_infura_api_key

# Smart Contract Address (Update after deployment)
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

#### How to Add Environment Variables:

1. In the Vercel dashboard, go to your project
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable with the following settings:
   - **Name**: The variable name (e.g., `VITE_CHAIN_ID`)
   - **Value**: The variable value (e.g., `11155111`)
   - **Environment**: Select all environments (Production, Preview, Development)

### 4. Deploy the Application

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Once deployed, you'll receive a Vercel URL (e.g., `https://hidden-gladiator-wagers.vercel.app`)

### 5. Custom Domain Setup (Optional)

If you have a custom domain:

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update your domain's DNS records as instructed

### 6. Smart Contract Deployment

Before the application is fully functional, you need to deploy the smart contract:

#### Using Hardhat (Recommended)

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Create `.env` file with your configuration:
```bash
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. Deploy the contract:
```bash
npm run deploy:contract
```

4. Update the `VITE_CONTRACT_ADDRESS` environment variable in Vercel with the deployed contract address

#### Using Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file `GladiatorArena.sol`
3. Copy the contract code from `contracts/GladiatorArena.sol`
4. Compile the contract
5. Deploy to Sepolia testnet
6. Copy the deployed contract address

### 7. Post-Deployment Configuration

After deployment:

1. **Update Contract Address**: Set the `VITE_CONTRACT_ADDRESS` environment variable in Vercel
2. **Test Wallet Connection**: Verify that wallet connections work properly
3. **Test Betting Flow**: Ensure the betting functionality works with the deployed contract
4. **Monitor Performance**: Check Vercel analytics for any performance issues

### 8. Production Checklist

- [ ] Environment variables configured
- [ ] Smart contract deployed and address updated
- [ ] Wallet connections working
- [ ] Betting functionality tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Performance monitoring enabled

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify build command is correct
   - Check for TypeScript errors

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Redeploy after adding new variables
   - Check variable names match exactly

3. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure contract address is set

4. **Smart Contract Interaction Failures**:
   - Verify contract is deployed
   - Check contract address is correct
   - Ensure user has sufficient ETH for gas

### Support

For deployment issues:
- Check Vercel documentation
- Review build logs in Vercel dashboard
- Test locally with `npm run build` and `npm run preview`

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to the repository
2. **Contract Security**: Audit smart contracts before mainnet deployment
3. **Wallet Security**: Use hardware wallets for contract deployment
4. **Access Control**: Implement proper access controls in smart contracts

## Performance Optimization

1. **Image Optimization**: Use Vercel's automatic image optimization
2. **Code Splitting**: Vite automatically handles code splitting
3. **Caching**: Configure appropriate cache headers
4. **CDN**: Vercel provides global CDN automatically

---

**Repository**: https://github.com/henriquefreitas1/hidden-gladiator-wagers

**Contract Address**: Update after deployment