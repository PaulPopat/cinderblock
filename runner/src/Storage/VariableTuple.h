#include "./Variable.h"
#include "./VariableTuplePart.h"
#include <vector>

namespace Storage
{
  class VariableTuple : Variable
  {
  public:
    const static char TypeName = 10;
    VariableTuple(std::vector<VariableTuplePart> value);
    VariableTuple(val value);
    ~VariableTuple();

    const val raw() const;

  private:
    std::vector<VariableTuplePart> value;
  };
}