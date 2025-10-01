import React from "react";
import { Modal, Button } from "react-bootstrap";
import { CartWithItems } from "../../types/Cart";

interface Props {
  finalizedOrder: CartWithItems | null;
  showOrderModal: boolean;
  onClose: () => void;
}

const FinalizedOrderModal: React.FC<Props> = ({
  finalizedOrder,
  showOrderModal,
  onClose,
}) => {
  return (
    <Modal show={showOrderModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Pedido Finalizado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {finalizedOrder ? (
          <>
            <p>Seu pedido foi realizado com sucesso!</p>
            <p>
              Total de itens:{" "}
              {finalizedOrder.items.reduce((acc, item) => acc + item.productQtd, 0)}
            </p>
            <p>Total da compra: R$ {finalizedOrder.totalOrder.toFixed(2)}</p>
            <ul>
              {finalizedOrder.items.map((item) => (
                <li key={item.id}>
                  {item.productQtd} x{" "}
                  {typeof item.productId === "string"
                    ? item.productId
                    : item.productId.name}{" "}
                  - R$ {item.totalAmount.toFixed(2)}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Não há pedido para mostrar.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FinalizedOrderModal;
