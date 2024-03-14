import { ChangeEvent, useEffect, useState } from "react";
import { Api, BriefingState, BriefingType } from "../../utils/Api";
import "./EditModal.css"
import { BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, Editor, EditorProvider, Toolbar } from "react-simple-wysiwyg";

export function EditModal(props : {
    briefingId? : string, 
    closeAction : () => void, 
    saveAction : (briefing? : BriefingType) => void,
    title? : string
}){

    const [briefing, setBriefing] = useState<BriefingType>({
        client_name: "", date: new Date(), deleted: false, description: "", id: "", state: BriefingState.negociacao
    });

    const api : Api = new Api();

    useEffect(()=>{
        if(!props.briefingId){
            return;
        }

        try{
            api.getById(props.briefingId).then((response) => {
                if(response.status == 200){
                    return response.json();
                }
                return undefined;
            }).then((briefingResponse : BriefingType) => {
                setBriefing(briefingResponse);
            })
            .catch((err) => {
                console.error(err)
            })
        }
        catch(err){
            console.error(err)
        }

    }, [])

    const changeDescription = (e : string) =>{

        if(!briefing)
            return;

        setBriefing({...briefing, description: e})

    }

    const changeName = (e : ChangeEvent<HTMLInputElement>) =>{

        if(!briefing)
            return;

        setBriefing({...briefing, client_name: e.target.value})

    }

    return (
        <div className="briefing-modal-container">
            <div className="briefing-modal">
                <div className="title">
                    {
                        props.title ? props.title :
                        "Editar briefing"
                    }
                </div>
                <div className="input-field-container">
                    <div className="client-name">
                        <label htmlFor="client-name">Nome do cliente</label>
                        <input 
                            type="text" name="client-name" 
                            id={`client-name-${props.briefingId}`} 
                            value={briefing?.client_name}
                            onChange={changeName}
                        />
                    </div>
                    <div className="description">
                        <label htmlFor="description">Descrição</label>
                        {/* <textarea
                            name="description" 
                            id={`description-${props.briefingId}`} 
                            value={briefing?.description}
                            onChange={changeDescription}
                        /> */}
                        <EditorProvider>
                            <Editor 
                                value={briefing.description} 
                                onChange={(e) => {changeDescription(e.target.value)}} 
                                className="editor"
                                containerProps={{style: {
                                    overflow: "scroll", resize: "both", 
                                    height: "auto", width: "fit-content", 
                                    wordBreak: "break-all", minWidth: "100%",
                                    maxWidth: "80vw", maxHeight: "60vh",
                                    backdropFilter: "blur(100px)"
                                }}}
                            >
                                <Toolbar>
                                    <BtnBold/>
                                    <BtnItalic/>
                                    <BtnBulletList/>
                                    <BtnNumberedList/>
                                    <BtnLink/>
                                </Toolbar>
                            </Editor>
                        </EditorProvider>
                    </div>
                </div>
                <div className="button-container">
                    <div className="button close-button" onClick={props.closeAction}>
                        Fechar
                    </div>
                    <div className="button save-button" onClick={() => {props.saveAction(briefing)}}>
                        Salvar
                    </div>
                </div>
            </div>
        </div>
    )
}