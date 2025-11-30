// Service untuk mengakses data JSON
const ApiService = {
    async getData() {
        // Return data dummy untuk testing
        return {
            stok: [
                {
                    kode: "EKMA4116",
                    judul: "Pengantar Manajemen",
                    kategori: "MK Wajib",
                    upbjj: "Jakarta",
                    lokasiRak: "R1-A3",
                    harga: 65000,
                    qty: 28,
                    safety: 20
                }
            ],
            tracking: [
                {
                    noDO: "DO2025-001",
                    nim: "123456789", 
                    nama: "Rina Wulandari",
                    status: "Dalam Perjalanan",
                    ekspedisi: "JNE Express"
                }
            ]
        };
    },

    async getBahanAjar() {
        const data = await this.getData();
        return data.stok;
    },

    async getDeliveryOrders() {
        const data = await this.getData();
        return data.tracking;
    }
};