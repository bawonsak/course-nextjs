import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Member', email: 'member@email.com', password: bcrypt.hashSync('1234', 10), role: 'member', createdAt: new Date(), updatedAt: new Date()},
      { name: 'Admin', email: 'admin@email.com.com', password: bcrypt.hashSync('1234', 10), role: 'admin', createdAt: new Date(), updatedAt: new Date()},
      { name: 'Vip', email: 'vip@email.com.com', password: bcrypt.hashSync('1234', 10), role: 'vip', createdAt: new Date(), updatedAt: new Date()},
    ],
  })

  const nike = await prisma.brand.create({
    data: {
      name: 'Nike'
    },
  })

  const adidas = await prisma.brand.create({
    data: {
      name: 'Adidas'
    },
  })

  await prisma.product.createMany({
    data: [
      { name: 'Nike React Infinity Run Flyknit', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-run-flyknit-mens-running-shoe-zX42Nc.jpg'},
      { name: 'Nike React Miler', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-5cc7de3b-2afc-49c2-a1e4-0508997d09e6/react-miler-mens-running-shoe-DgF6nr.jpg' },
      { name: 'Nike Air Zoom Pegasus 37', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33b0a0a5-c171-46cc-ad20-04a768703e47/air-zoom-pegasus-37-womens-running-shoe-Jl0bDf.jpg' },
      { name: 'Nike Joyride Run Flyknit', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/99a7d3cb-e40c-4474-91c2-0f2e6d231fd2/joyride-run-flyknit-womens-running-shoe-HcfnJd.jpg'},
      { name: 'Nike Mercurial Vapor 13 Elite FG', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9dda6202-e2ff-4711-9a09-0fcb7d90c164/mercurial-vapor-13-elite-fg-firm-ground-soccer-cleat-14MsF2.jpg'},
      { name: 'Nike Phantom Vision Elite Dynamic Fit FG', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/s1amp7uosrn0nqpsxeue/phantom-vision-elite-dynamic-fit-fg-firm-ground-soccer-cleat-19Kv1V.jpg'},
      { name: 'Nike Phantom Venom Academy FG', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/whegph8z9ornhxklc8rp/phantom-venom-academy-fg-firm-ground-soccer-cleat-6JVNll.jpg'},
      { name: 'Nike Mercurial Vapor 13 Elite Tech Craft FG', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/vhbwnkor8sxt8qtecgia/mercurial-vapor-13-elite-tech-craft-fg-firm-ground-soccer-cleat-l38JPj.jpg'},
      { name: 'Nike Mercurial Superfly 7 Pro MDS FG', brandId: nike.id, image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-a52a8aec-22dc-4982-961b-75c5f4c72805/mercurial-superfly-7-pro-mds-fg-firm-ground-soccer-cleat-mhcpdN.jpg'},
      { name: 'Nike Air Force 1', brandId: nike.id, image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/178b2a46-3ee4-492b-882e-f71efdd53a36/air-force-1-big-kids-shoe-2zqp8D.jpg'},
      { name: 'Nizza X Disney', brandId: adidas.id, image: 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/ef901c7aeac042578eceab9d0159196c_9366/Nizza_x_Disney_Sport_Goofy_Shoes_White_FW0651_01_standard.jpg'},
      { name: 'X_PLR', brandId: adidas.id, image: 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/a36518227134495da766ab9d01772fa2_9366/X_PLR_Shoes_Red_FY9063_01_standard.jpg'},
      { name: 'Stan Smith', brandId: adidas.id, image: 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/d0720712d81e42b1b30fa80800826447_9366/Stan_Smith_Shoes_White_M20607_M20607_01_standard.jpg'},
      { name: 'NMD_R1', brandId: adidas.id, image: 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/99ca762cb9054caf82fbabc500fd146e_9366/NMD_R1_Shoes_Blue_FY9392_01_standard.jpg'},
      { name: 'NMD_R1 Flash Red', brandId: adidas.id, image: 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/90f85768e3894aeaab67aba0014a3379_9366/NMD_R1_Shoes_Red_FY9389_01_standard.jpg'},
      { name: 'Superstar', brandId: adidas.id, image: 'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/12365dbc7c424288b7cdab4900dc7099_9366/Superstar_Shoes_White_FW3553_FW3553_01_standard.jpg'}
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })