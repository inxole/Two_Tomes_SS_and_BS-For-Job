import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useState } from "react"
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ReportTwoToneIcon from '@mui/icons-material/ReportTwoTone'
import { IconStyle } from "../Rnd"
import { useRecoilValue } from "recoil"
import { DeviceMobile } from "../atom"

const Attention_Button = () => {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }
    const usedMobile = useRecoilValue(DeviceMobile)

    return (
        <span style={{ display: 'flex', justifyContent: 'center' }} >
            <ReportTwoToneIcon
                fontSize='large' titleAccess="初期の画面に戻ります。"
                sx={{
                    ...IconStyle,
                    background: 'rgba(255, 101, 101, 0.7)',
                    '&:hover': { background: 'rgb(255, 0, 0)' }
                }}
                onClick={handleClickOpen}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        margin: 0,
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: '550px',
                        width: usedMobile ? '400px' : '500px',
                        overflow: 'hidden'
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', fontSize: 'large' }} >
                    利用規約
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText sx={{ textAlign: 'center', fontSize: 'medium', fontWeight: 'bold' }} >プライバシーポリシー</DialogContentText>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        本ウェブサイト(以下、「当サイト」という)は、inxoleが運営しています。当サイトは、利用者のプライバシーを尊重し、個人情報の保護に努めます。
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        1. 収集する情報：当サイトは、利用者がサイトを訪問する際に、アクセスログなどの基本的な情報を収集することがあります。これには、IPアドレス、アクセス日時、ブラウザの種類などが含まれます。
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        2. 情報の使用目的：収集した情報は、サイトの改善、利用者の体験の向上、および統計的な分析のためにのみ使用します。
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        3. 情報の共有と開示：当サイトは、収集した情報を第三者に販売、共有、またはレンタルしません。法的要求がある場合を除き、いかなる個人情報も開示しません。
                    </Typography>
                    <DialogContentText sx={{ textAlign: 'center', fontSize: 'medium', fontWeight: 'bold' }} >免責事項</DialogContentText>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        1. 内容の正確性について:当サイトに掲載される情報には細心の注意を払っていますが、その正確性や安全性を保証するものではありません。掲載情報の使用によって生じたいかなる損害も、inxoleは責任を負いません。
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        2. 外部リンク：当サイトからリンクされた外部サイトの内容や、その利用によって生じる損害について、inxoleは一切の責任を負いません。また、外部サイトのプライバシーポリシーや利用規約についても確認することを推奨します。
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        3. 利用規約の変更：当サイトは、予告なく利用規約を変更することがあります。利用者が変更後も当サイトを利用する場合、変更後の利用規約に同意したものとみなします。
                    </Typography>
                    <DialogContentText sx={{ textAlign: 'center', fontSize: 'medium', fontWeight: 'bold' }} >引用元</DialogContentText>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        1. このウェブサイトは、スクエアエニックスの『NieRシリーズ』に基づく非公式のファンコンテンツです。二次創作ガイドライン（2021年2月2日発行）に準拠して運営されていますが、スクエアエニックスとは一切関係ありません。
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        2. 二次創作ガイドラインの詳細については、以下のリンクをご確認ください：
                        <a href="https://blog.jp.square-enix.com/nier/2021/02/02/nier_1.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                        >
                            https://blog.jp.square-enix.com/nier/2021/02/02/nier_1.html
                        </a>
                    </Typography>
                    <Typography gutterBottom sx={{ textAlign: 'start', fontSize: 'small' }} >
                        3. © 2021 SQUARE ENIX CO., LTD. All Rights Reserved.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', height: "48px" }}>
                    <Button onClick={handleClose} autoFocus>
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </span >
    )
}

export default Attention_Button